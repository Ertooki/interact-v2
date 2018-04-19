import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../services';
import {MatPaginator, MatTabChangeEvent} from '@angular/material';
import {AttributesDatasource} from '../../datasources';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-incident-view',
  templateUrl: './incident-view.component.html',
  styleUrls: ['./incident-view.component.css']
})
export class IncidentViewComponent implements OnInit {

  id: number;
  event;
  mainData;
  currentTab;
  displayedColumns = ['parameter', 'value'];
  attrDisplayedColumns = ['id', 'value', 'type', 'author'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  attrDataSource;

  constructor(private route: ActivatedRoute, private eventService: EventService) {
    this.route.params.subscribe( params => this.id = params.id );
    this.attrDataSource = new AttributesDatasource(eventService);
  }

  ngOnInit() {
    this.eventService.findOne(this.id)
      .subscribe(
        data => {
          this.event = data;
          this.event.tags = this.event.tags.split(',');
          this.mainData = [
            {
              parameter: 'ID',
              value: this.event.id,
            },
            {
              parameter: 'Назва організації',
              value: this.event.organizationName,
            },
            {
              parameter: 'Дата',
              value: this.event.date,
            },
            {
              parameter: 'Теги',
              value: this.event.tags,
            },
            {
              parameter: 'Інформація',
              value: this.event.info,
            },
          ];
          console.log(this.event);
        },
        error => {
          console.log(error);
        }
      );
    this.eventService.getResponsibles(this.id)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }

  tabChanged(event: MatTabChangeEvent) {
    this.currentTab = event.index;
    if (event.index === 1 || event.index === 2) {
      this.attrDataSource.loadAttributes(this.id, event.index);
    }
  }

  loadAttributesPage() {
    this.attrDataSource.loadAttributes(this.id, this.currentTab, this.paginator.pageSize, this.paginator.pageIndex);
  }

}
