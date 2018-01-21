import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TableService } from '../dbservice/table.service';
/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {

  animal: string;
  name: string;
  user = { username: '', password: '' };

  constructor(private tableService: TableService, public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      this.tableService.login(this.user.username, this.user.password).then(res => console.log(res));
    });
  }

}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'dialog-content.component.html',
})
export class DialogContentComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
