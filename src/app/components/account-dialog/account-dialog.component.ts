import {Component, Input, OnInit} from '@angular/core';
import {AddEditDialogMode} from "../../enums/AddEditDialogMode";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../../service/account.service";

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent implements OnInit {
  @Input() mode!: AddEditDialogMode;
  @Input() accountId!: any;
  dialogMode = AddEditDialogMode;
  formGroup!: FormGroup<any>;
  formReady: boolean = false;
  submitButtonDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private accountService: AccountService,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    if (this.mode === AddEditDialogMode.ADD) {
      this.formGroup = this.fb.group({
        name: '',
        description: ''
      });
      this.formReady = true;
    } else if (this.mode === AddEditDialogMode.EDIT && this.accountId) {
      this.accountService.findUserAccountSummaryByAccountId(this.accountId)
        .subscribe({
          next: value => {
            this.formGroup = this.fb.group(
              {
                name: value.name,
                description: value.description
              }
            );
            this.formReady = true;
          },
          error: err => {
            console.error(err);
          }
        })
    } else {
      console.error("CategoriesAddEditDialogComponent. Не передана id категории для редактирования.")
    }
  }


  createAccount() {

  }

  updateAccount() {

  }
}
