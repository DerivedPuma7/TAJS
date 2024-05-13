import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";

export default class Service {
  #filename
  constructor({ filename }){
    console.log(filename);
    this.#filename = filename
  }

  #hashPassword(password) {
    return crypto.createHash('sha256')
      .update(password)
      .digest('hex');
  }

  create({ username, password }) {
    const data = JSON.stringify({
      username,
      password: this.#hashPassword(password),
      createdAt: new Date().toISOString()
    }).concat('\n');

    return fs.appendFile(this.#filename, data);
  }

  async read() {
    const fileExists = fsSync.existsSync(this.#filename);
    if(!fileExists) return [];

    const data = await fs.readFile(this.#filename, 'utf-8');
    const lines = data
      .split('\n')
      .filter(line => !!line);
    
    if(!lines) return [];
    return lines
      .map(line => {
        const parsed = JSON.parse(line);
        const { password, ...rest  } = parsed;
        return rest;
      });
  }
}