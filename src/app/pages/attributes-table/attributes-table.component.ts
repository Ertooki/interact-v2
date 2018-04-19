import {Component, OnInit, ViewChild} from '@angular/core';
import {AttrTypeDatasource} from '../../datasources';
import {MatPaginator} from '@angular/material';
import {AttrTypeService} from '../../services';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-attributes-table',
  templateUrl: './attributes-table.component.html',
  styleUrls: ['./attributes-table.component.css']
})
export class AttributesTableComponent implements OnInit {

  displayedColumns = ['id', 'name', 'group'];
  dataSource: AttrTypeDatasource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private attrTypeService: AttrTypeService) { }

  ngOnInit() {
    this.dataSource = new AttrTypeDatasource(this.attrTypeService);
    this.dataSource.loadAttributeTypes();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadAttrTypesPage())
      )
      .subscribe();
  }

  loadAttrTypesPage() {
    this.dataSource.loadAttributeTypes(this.paginator.pageSize, this.paginator.pageIndex);
  }

}
