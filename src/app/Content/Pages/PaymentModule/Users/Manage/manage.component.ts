import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { CustomValidators } from '../../../../../Core/Utilities/CustomValidations/custom.validators';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})


export class ManageComponent implements OnInit {

  pageModel: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {

    this.pageModel = this._formBuilder.group({
      myFullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      contactPreference: ['email'],
      emailGroup: this._formBuilder.group({
        myEmail: ['', [Validators.required, Validators.email, CustomValidators.emailDomain("google.com")]],
        myEmailConfirm: ['', [Validators.required]],
      }, { validators: CustomValidators.MatchControlsValue("myEmail", "myEmailConfirm") }),
      passwordGroup: this._formBuilder.group({
        myPassword: ['', [Validators.required]],
        myPasswordConfirm: ['', [Validators.required]],
      }, { validators: CustomValidators.MatchControlsValue("myPassword", "myPasswordConfirm") }),
      myPhone: [''],
      mySkills: this._formBuilder.group({
        skillName: ['', [Validators.required]],
        experienceInYears: ['', [Validators.required]],
        proficiency: ['', [Validators.required]]
      }),
    });


    this.pageModel.valueChanges.subscribe((data) => {
      this.logKeyValuePairs(this.pageModel);
    });


    this.pageModel.get('contactPreference')
      .valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
      });

  }

  onSubmit() {

    // One Way to Declare Form Array - By new keyword
    const formArray = new FormArray([
      new FormControl('Malang', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required)
      }),
      new FormArray([])
    ]);

    console.log(formArray.length);
    console.log(formArray);

    for (const control of formArray.controls) {
      if (control instanceof FormControl) {
        console.log('control is FormControl');
      }
      if (control instanceof FormGroup) {
        console.log('control is FormGroup');
      }
      if (control instanceof FormArray) {
        console.log('control is FormArray');
      }
    }


    // Second Way to Declare Form Array - By FormBuilder
    const formArray2 = this._formBuilder.array([
      new FormControl('Sajjad', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required)
      }),
      new FormArray([])
    ]);

    console.log(formArray2.length);
    console.log(formArray2);

    for (const control of formArray2.controls) {
      if (control instanceof FormControl) {
        console.log('control is FormControl');
      }
      if (control instanceof FormGroup) {
        console.log('control is FormGroup');
      }
      if (control instanceof FormArray) {
        console.log('control is FormArray');
      }
    }

    // What the difference between Array and Group

    const ByArray = this._formBuilder.array([
      new FormControl('Sajjad', Validators.required),
      new FormControl('Email', Validators.required),
      new FormControl('Male', Validators.required),
    ]);

    const ByGroup = this._formBuilder.group([
      new FormControl('Sajjad', Validators.required),
      new FormControl('Email', Validators.required),
      new FormControl('Male', Validators.required),
    ]);

    console.log(ByArray);
    console.log(ByGroup);

    console.log(ByArray.value);
    console.log(ByGroup.value);


    ByArray.push(new FormControl('Working',Validators.required));
    console.log(ByArray.at(3).value);
   
  }

  logKeyValuePairs(group: FormGroup = this.pageModel): void {

    Object.keys(group.controls).forEach((key: string) => {

      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key);

      console.log('Key = ' + key + ' && Value = ' + abstractControl.value);

      // Clear the existing validation errors
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {

        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractControl);
      }

    });
  }

  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'myFullName': '',
    'myEmail': '',
    'myEmailConfirm': '',
    'emailGroup': '',
    'myPassword': '',
    'myPasswordConfirm': '',
    'passwordGroup': '',
    'myPhone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'myFullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 8 characters.'
    },
    'myEmail': {
      'required': 'Email is required.',
      'email': 'Invalid Email',
      'emailDomain': 'Invalid Domain'
    },
    'myEmailConfirm': {
      'required': 'Confirm Email is required.',

    },
    'emailGroup': {
      'NotMatch': 'Email and Confirm Email do not match'
    },
    'myPassword': {
      'required': 'Password is required.',
    },
    'myPasswordConfirm': {
      'required': 'Password Confirm is required.',
    },
    'passwordGroup': {
      'NotMatch': 'Password and Confirm Password do not match'
    },
    'myPhone': {
      'required': 'Phone is required.',
      'minlength': 'Phone must be greater than 2 characters.',
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };

  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.pageModel.get('myPhone');
    const emailFormControl = this.pageModel.get('myEmail');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators([Validators.required, Validators.minLength(4)]);
      emailFormControl.clearValidators();
    } else {
      emailFormControl.setValidators([Validators.required, Validators.email]);
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
    emailFormControl.updateValueAndValidity();
  }


  onLoadDataClick() {
    this.pageModel.setValue({
      myFullName: 'Sajjad Hussain',
      myEmail: 'sajjadlogic@live.com',
      mySkills: {
        skillName: 'C#',
        experienceInYears: 5,
        proficiency: 'beginner'
      }
    });
  }
}

