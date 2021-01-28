import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../../class/client';
import { ClientService } from '../../../services/client.service';
import { ModalService } from '../../../services/modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Input() client: Client;
  title: string = 'PROFILE';
  public selectedPhoto: File;
  public progress: number = 0;

  constructor(
    private clientService: ClientService,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {}

  selectPhoto(event) {
    this.selectedPhoto = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedPhoto);
    if (this.selectedPhoto.type.indexOf('image') < 0) {
      swal.fire('Error select', `The file must be of type image`, 'error');
      this.selectedPhoto = null;
    }
  }

  uploadPhoto() {
    if (!this.selectedPhoto) {
      swal.fire('Error upload', `Select a photo`, 'error');
    } else {
      this.clientService
        .uploadPhoto(this.selectedPhoto, this.client.id)
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.client = response.client as Client;
            swal.fire('Photo upload', response.mensaje, 'success');
          }
        });
    }
  }

  closeModal() {
    this.modalService.closeModal();
    this.selectedPhoto = null;
    this.progress = 0;
  }
}
