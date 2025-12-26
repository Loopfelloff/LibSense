type userNameError = {
    firstName : boolean;
    lastName : boolean ;
    totalLength : boolean;
}

type passwordError = {
    symbol : boolean;
    num : boolean;
    totalLength : boolean;
}


const checkUsernameValidity : (firstName : string , middleName : string , lastName : string) => userNameError = (firstName : string , middleName : string , lastName : string) => {
    firstName = firstName.trim()
    middleName = middleName.trim()
    lastName = lastName.trim()

    let firstNameBoolean = false
    let lastNameBoolean = false
    let totalLengthBoolean = false

    if(firstName === '') firstNameBoolean = true    
    if(lastName === '') lastNameBoolean = true 
 
    const totalLength = firstName.length + middleName.length + lastName.length


    if(totalLength >=8) totalLengthBoolean = false 
    
    return {firstName : firstNameBoolean , lastName : lastNameBoolean , totalLength : totalLengthBoolean}
};

const checkEmailValidity  : (email : string) => boolean = (email : string)=>{
    email = email.trim()

    const emailRegex : RegExp =   /[^\s@]+@[^\s@]+\.[^\s@]+$/


    return !emailRegex.test(email)
}

const checkPasswordValidity : (password : string) => passwordError = (password : string)=>{
    password = password.trim()
    const passwordSymbolRegex : RegExp = /[^a-zA-Z0-9]+/
    const passwordNumberRegex : RegExp = /[0-9]+/
    const passwordLength = password.length

    return {symbol : !passwordSymbolRegex.test(password) , num : !passwordNumberRegex.test(password) , totalLength : !(passwordLength >= 8) }
}



export {checkUsernameValidity , checkEmailValidity , checkPasswordValidity }

