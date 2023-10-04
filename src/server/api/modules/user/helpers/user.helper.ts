import argon2, { hash } from "argon2";

/**
 * bun:
 * Getting this issue when using bun / ts-node with argon2
 * Cannot find module '/mnt/sda1/apps/[user]/node_modules/argon2/lib/binding/napi-v3/argon2.node'
 */
export class UserHelper {
  static async hashPassword(password: string): Promise<string> {
    return await hash(password);
  }

  static async verifyPassword(
    passwordFromDb: string,
    passwordFromInput: string
  ) {
    return await argon2.verify(passwordFromDb, passwordFromInput);
  }
}
