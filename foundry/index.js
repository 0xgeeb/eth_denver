const random = new Uint8Array(32);
crypto.getRandomValues(random);
const salt = "0x" + Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("");

console.log(salt)