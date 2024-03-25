import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/users.model';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  genders: string[] = ['Male', 'Female'];
  packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  program: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  //create a form:
  registrationForm!: FormGroup;
  private userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: NgToastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      program: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
      image: ['']
    });

    this.registrationForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe((val) => {
      this.userIdToUpdate = val['id'];
      if (this.userIdToUpdate) {
        this.isUpdateActive = true;
        this.api.getRegisteredUserId(this.userIdToUpdate).subscribe({
          next: (res) => {
            this.fillFormToUpdate(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  fillFormToUpdate(user: User) {
    this.registrationForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      program: user.program,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate,
    });
  }

  submit() {
    this.api.postRegistration(this.registrationForm.value).subscribe((res) => {
      // this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
      // this.registrationForm.reset();
    });
  }
  calculateBmi(heightValue: number) {
    const weight = this.registrationForm.value.height;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);

    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue('UnderWeight');
        break;

      case bmi >= 18.5 && bmi < 24.9:
        this.registrationForm.controls['bmiResult'].patchValue('Normal');
        break;

      case bmi >= 24.9 && bmi < 29.9:
        this.registrationForm.controls['bmiResult'].patchValue('OverWeight');
        break;

      case bmi >= 29.9:
        this.registrationForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }

  update() {
    this.api
      .updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
      .subscribe((res) => {
        this.toastService.success({
          detail: 'SUCCESS',
          summary: 'User Details Updated Successful',
          duration: 3000,
        });
        this.router.navigate(['list']);
        this.registrationForm.reset();
      });
  }

  fileName = '';

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);
      const upload$ = this.http.post('/api/thumbnail-upload', formData);
      upload$.subscribe();
    }
  }
}
