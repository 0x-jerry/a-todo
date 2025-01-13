import bcrypt from 'bcrypt'

export function cryptPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err)

      bcrypt.hash(password, salt, (err, hash) => (err ? reject(err) : resolve(hash)))
    })
  })
}

export function comparePassword(plainPass: string, hashword: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) =>
      err ? reject(err) : resolve(isPasswordMatch),
    )
  })
}
