function testWithTimeout(regex, string, timeout = 100) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Regex execution timed out")), timeout);

        try {
            const result = regex.test(string);
            clearTimeout(timer);
            resolve(result);
        } catch (error) {
            clearTimeout(timer);
            reject(error);
        }
    });
}

async function validateEmail(email) {
    let re = /\S+@\S+\.\S+/;

    if ((await testWithTimeout(re, email))) {
        return true;
    } else {
        return false;
    }
}

function validateUsername(value) {
    return value.length >= 4 && value.length <= 16;
}

function validatePassword(value) {
    return value.length >= 6 && value.length <= 32;
}

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword
}