const bcrypt = require('bcryptjs');

const password = 'Ch1103Sc!'; // Known password
bcrypt.hash(password, 12, (err, hash) => {
    console.log('Hash:', hash);
})

/*bcrypt.compare(password, hash, (err, isMatch) => {
    console.log('Password match:', isMatch); // Should be true if the password and hash match
    if (err) {
        console.error(err);
    }
});*/
