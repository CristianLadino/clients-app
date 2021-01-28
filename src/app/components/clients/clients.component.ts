import { Component, OnInit } from '@angular/core';
import { Client } from '../../class/client';
import { ClientService } from '../../services/client.service';
import { ModalService } from '../../services/modal.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  clients: Client[];
  paginator: any;
  selectedClient: Client;

  constructor(
    private clientService: ClientService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.clientService
        .getClients(page)
        .pipe(
          tap((resp) => {
            console.log('clientsComponent: tap 3');
            (resp.content as Client[]).forEach((client) => {
              console.log(client.name);
            });
          })
        )
        .subscribe((resp) => {
          this.clients = resp.content as Client[];
          this.paginator = resp;
        });
    });
  }

  delete(client: Client): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swal
      .fire({
        title: 'Are you sure?',
        text: `Sure you want to delete the client ${client.name} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clientService.delete(client.id).subscribe((res) => {
            this.clients = this.clients.filter((cli) => cli !== client);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              `Client ${client.name} has been deleted.`,
              'success'
            );
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  modalProfile(client: Client) {
    this.selectedClient = client;
    this.modalService.openModal();
  }
}
