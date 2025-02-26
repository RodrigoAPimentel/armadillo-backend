#!/bin/bash

PROJECT_NAME="$(. ./.env && echo ${PROJECT_NAME})"
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "$(pwd)")
TEMPORARY_FILE=/tmp/selected_services.txt

ACTION=""
ACTION_COMMAND=""
ACTION_DESCRIPTION=""
ACTION_DESCRIPTION_ALL=""
ALL_CONTAINERS=false
DOCKER_PRUNE=false

banner () {
    printf "**************************************************************************\n"
    printf "*************************** PROJECT CONTROLLER ***************************\n"
    printf "**************************************************************************\n"
    printf "*** 📜 Developed By: Rodrigo Pimentel ************************************\n\n"
}

informations () {
    echo -e "📜  Information:"
    echo -e "   📦  Project Name: ${PROJECT_NAME}"
    echo -e "   📁  Project Root: ${PROJECT_ROOT}"
    echo ""
}

params_configurations () {
    case "$1" in
        up)
            ACTION="up";
            ACTION_COMMAND="up -d"
            ACTION_DESCRIPTION_ALL="Starting"
            ACTION_DESCRIPTION="Do you want to start"
            
            echo -e '>>>>> 🟢 🆙 Starting Docker containers ... \n'
            ;;
        down)
            ACTION="down"
            ACTION_COMMAND="down"
            ACTION_DESCRIPTION_ALL="Stopping"
            ACTION_DESCRIPTION="Do you want to stop"
            echo -e ">>>>> 🔴 ⬇️  Stopping Docker containers ...\n"
            ;;
        *)
            echo -e "⚠️    Invalid command. Use 'up' to start Docker containers or 'down' to stop them.   ⚠️"
            exit 1
            ;;
    esac
    
    if [[ "$2" == "--all" ]]; then
        ALL_CONTAINERS=true
        if [[ "$1" == "down" && "$3" == "--prune" ]]; then
            DOCKER_PRUNE=true
        elif [[ "$3" == "--prune" ]]; then
            echo -e "⚠️    Invalid command. '--prune' can only be used with 'down --all --prune'.   ⚠️"
            exit 1
        fi
    elif [[ "$2" == "--prune" ]]; then
        echo -e "⚠️    Invalid command. '--prune' can only be used with 'down --all --prune'.   ⚠️"
        exit 1
    fi
}

check_container_running() {
    echo -e "   🔍 Checking if it is running ..."
    if [[ $(docker ps --filter "name=${1}" --filter "status=running" -q) ]]; then
        if [[ "$2" == "up" ]]; then
            echo "      ⚠️  The service is already running."
            return 0
        fi
        return 1
    else
        if [[ "$2" == "down" ]]; then
            echo "      ⚠️  The service is not running."
            return 0
        fi
        return 1
    fi
}

prompt_user() {
    local attempts=0
    local srv=$(basename $1)

    while [[ $attempts -lt 3 ]]; do
        read -p "📌 $ACTION_DESCRIPTION all containers of ${srv^^}? [y/n]: " -n 1 -r response
        echo

        if [[ ${response,,} =~ ^[y]$ ]]; then
            if check_container_running $srv $ACTION; then
                break
            else
                echo ""$1"docker-compose.yml|$ACTION_DESCRIPTION_ALL|$srv" >> $TEMPORARY_FILE
                break
            fi
        elif [[ ${response,,} =~ ^[n]$ ]]; then
            break
        else
            echo -e "    ⚠️  Incorrect choice. Please respond with 'y' or 'n'."
            ((attempts++))
        fi

    done
}

execute_action() {
    echo -e "\n🎯 $2 ${3^^} ..."
     
    if [[ -f $1 ]]; then
        export BIN_DIR=$3
        check_container_running $3 $ACTION || docker-compose -f $1 --project-name $PROJECT_NAME --project-directory $PROJECT_ROOT $ACTION_COMMAND
    else
        echo "    ❌  File $1 not found."
    fi
}

run () {
    banner
    informations
    params_configurations $1 $2 $3

    if [[ $ALL_CONTAINERS == true ]]; then
        for dir in $PROJECT_ROOT/bin/*/; do        
            execute_action ""$dir"docker-compose.yml" "$ACTION_DESCRIPTION_ALL" "$(basename $dir)"
        done

        if [[ $ACTION == "down" && $DOCKER_PRUNE == true ]]; then
            echo -e "\n>>>>> 🧹  Cleaning up Docker system ..."

            docker system prune -a --volumes -f
        fi
    else
        > $TEMPORARY_FILE
        for dir in $PROJECT_ROOT/bin/*/; do
            prompt_user $dir
        done

        [[ -s $TEMPORARY_FILE ]] && echo -e "\n🚀🚀🚀 Starting actions ..."

        while IFS='|' read -r compose_file action_desc container_name; do
            execute_action "$compose_file" "$action_desc" "$container_name"
        done < $TEMPORARY_FILE
        rm $TEMPORARY_FILE
    fi
    
    echo -e "\n👋👋👋 Exiting ...";
}

########################################
########################################

run $1 $2 $3