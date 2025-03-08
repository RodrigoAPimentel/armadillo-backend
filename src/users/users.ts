import { Schema } from 'mongoose';

/**
 * Represents a user in the system.
 *
 * @interface Interface
 * @property {string} [_id] - The unique identifier of the user (optional).
 * @property {string} name - The name of the user.
 * @property {string} role - The role of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {boolean} [active] - Indicates whether the user is active (optional).
 */
export interface Interface {
  _id?: string;
  name: string;
  role: string;
  email: string;
  password: string;
  active?: boolean;
}

export const EntitySchema = new Schema<Interface>({
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  role: {
    type: String,
    required: [true, 'role is required!'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
