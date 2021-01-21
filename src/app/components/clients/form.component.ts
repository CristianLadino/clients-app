import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../class/client';
import { ClientService } from '../../services/client.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  public client: Client = new Client();
  public title: string = 'Create Client';
  public errors: string[];

  constructor(
    private ClientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getClientById();
  }

  getClientById(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.ClientService.getClient(id).subscribe(
          (client) => (this.client = client)
        );
      }
    });
  }

  public create(): void {
    this.ClientService.create(this.client).subscribe(
      (client) => {
        this.router.navigate(['/clients']);
        swal.fire(
          'New CLient',
          `Client ${this.client.name} created successfully!`,
          'success'
        );
      },
      (err) => {
        this.errors = err.error.errors as string[];
        console.error('Codigo de error desde el backend: ' + err.status);

        console.error(err.error.errors);
      }
    );
  }

  public update(): void {
    this.ClientService.update(this.client).subscribe(
      (client) => {
        this.router.navigate(['/clients']);
        swal.fire(
          'Client Update',
          `Client ${this.client.name} update successfully!`,
          'success'
        );
      },
      (err) => {
        this.errors = err.error.errors as string[];
        console.error('Codigo de error desde el backend: ' + err.status);

        console.error(err.error.errors);
      }
    );
  }
}
