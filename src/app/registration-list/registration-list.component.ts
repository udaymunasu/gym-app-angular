import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/users.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss'],
})
export class RegistrationListComponent implements OnInit {
  public users!: any;
  dataSource!: MatTableDataSource<User>;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'package',
    'enquiryDate',
    'image',
    'action',
  ];




  constructor(
    private apiService: ApiService,
    private router: Router,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.apiService.getRegisteredUser().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredData = this.users
        console.log(" this.users",  this.users)
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  edit(id: number) {
    this.router.navigate(['update', id]);
  }

  deleteUser(id: number) {
    this.apiService.deleteRegistered(id).subscribe({
      next: (res) => {
        this._snackBar.open("message", "action", {
          duration: 2000,
        });
        this.getUsers();
      },
      error: (err) => {
      },
    });
  }

  //search table by name:

  searchText: string = "";

  search(searchValue: string){
    this.searchText = searchValue;
    console.log(this.searchText)
  }

  filteredData: any
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
  
    // Filter the data based on the filter value
    if (!filterValue) {
      // If filter value is empty, display all data
      this.filteredData= this.users;
    } else {
      this.filteredData = this.users.filter((user: any) =>
        Object.values(user).some((value: any) =>
          typeof value === 'string' && value.toLowerCase().includes(filterValue)
        )
      );
    }
  }
  


  editingRow: number = -1;
  editingColumn: string = '';

  onCellClick(row: number, column: string) {
    this.editingRow = row;
    this.editingColumn = column;
  }

  onBlur(user: any) {
    this.editingRow = -1;
    this.editingColumn = '';

    // Update the corresponding user in the users array
    const index = this.users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      console.log('Updated user:', this.users[index]);
      // Call the API to update the user
      this.apiService.updateRegisterUser(user, user.id).subscribe(
        updatedUser => console.log('User updated:', updatedUser),
        error => console.error('Error updating user:', error)
      );
    }
  }

  isEditing(row: number, column: string): boolean {
    return this.editingRow === row && this.editingColumn === column;
  }
}
