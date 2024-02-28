import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { User } from "../../types/user";

import { AuthService } from "../../services/auth.service";
 
 
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})

export class UserComponent {
 
 
  userForm!: FormGroup;
  userError$: Observable<string> = of();
  userSuccess$: Observable<string> = of();
  isFormSubmitted: boolean = false;
  errorMsg :String = "";
  constructor(
    private formBuilder: FormBuilder,
    private authServie: AuthService
  ) {}
   
  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required,this.PasswordValidator]],
      role: ["", [Validators.required]],
      name: ["", [Validators.required]],
      email: ["", [Validators.required,this.EmailValidator]],
    });
    this.errorMsg="";
  }
   hasSpecialCharacters(inputString:string):boolean {
    // Define a regular expression for special characters
    const specialCharactersRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
   
    // Test if the inputString contains any special characters
    return specialCharactersRegex.test(inputString);
  }
  EmailValidator(control: AbstractControl):  ValidationErrors | null{
    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let emailValue=control.value as string;
    if(emailRegex.test(emailValue)){
      return null ;
   
    }
    return {EmailValidator :true};
  }
   
  MobileValidator(control: AbstractControl):  ValidationErrors | null{
    const mobileRegrex : RegExp= /^[0-9]{10,12}/;
    const mobileValue=control.value.toString();
    if(mobileRegrex.test(mobileValue)){
       return null;
   
    }
    return {MobileValidator :true};
  }
   
  PasswordValidator(control : AbstractControl): ValidationErrors |null{
    let passwordRegrex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const passwordValue= control.value as string;
    if(passwordRegrex.test(passwordValue)){
      return null;
    }
    return {PasswordValidator : true};
  }
  onSubmit() {
    this.isFormSubmitted = true;
    this.userSuccess$ = of('');
    this.userError$ = of('');
    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   
    if (this.userForm.invalid) {
      return;
    } else {
      const { username, password,email } = this.userForm.value;
      if(password.length < 8)
      {
        this.userError$ = of("Password must be of 8 characters");
        return;
      }
      if(this.hasSpecialCharacters(username))
      {
        this.userError$ = of("User Name must consist of letter and number only!!");
        return;
      }
      console.log(emailRegex.test(email));
      if(!emailRegex.test(email))
      {
        this.userError$ = of("Invalid Email Id!!");
        return;
   
      }
   
      const data=this.userForm.value;
      console.log(data);
      const customer: User = new User(data);
     
      this.authServie.createUser(customer).subscribe(
        (res: any) => {
          this.userSuccess$ = of("User created successfully");
        },
        (error) => {
          this.userError$ = of("User Alreay Exists:");
        }
      );
    }
  }
   
 
}