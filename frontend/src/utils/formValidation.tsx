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
    if(firstName === '') return {firstName : true , lastName : false , totalLength : false }
    
    if(lastName === '') return {firstName : false , lastName : true , totalLength : false }
 
    const totalLength = firstName.length + middleName.length + lastName.length


    if(totalLength >=8) return {firstName : false , lastName : false , totalLength : false}
    
    return {firstName : false , lastName : false , totalLength : true}
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

const checkConfirmPasswordValidity : (password : string , confirmPassword : string) => boolean = (password : string , confirmPassword: string)=>{
    password = password.trim()
    confirmPassword = confirmPassword.trim()

    return !(confirmPassword === password)
}


export {checkUsernameValidity , checkEmailValidity , checkPasswordValidity , checkConfirmPasswordValidity}
