import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { AccountRequest } from '../../types/Account-request';
import { AccountRequestDetails } from '../../types/Account-request-details';

@Component({
  selector: 'app-account-request-table',
  templateUrl: './account-request-table.component.html',
  styleUrls: ['./account-request-table.component.css']
})
export class AccountRequestTableComponent {
  accountsRequest$: Observable<AccountRequestDetails[]> = of();
  role: String | null = "";
  constructor(private bankService: BankService, private router: Router) { }
  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    const strUserId = localStorage.getItem("user_id");
 
 
    console.log(this.role);
 
    if (this.role === 'USER') {
      this.accountsRequest$ = this.bankService.getAccountRequestsByUser(strUserId);
    }
    if (this.role === 'ADMIN') {
      this.accountsRequest$ = this.bankService.getAccountRequests();
    }
 
    this.accountsRequest$.subscribe((data) => {
      console.log(data);
      
    })
}
}
