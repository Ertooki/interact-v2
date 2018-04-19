import { Component, OnInit } from '@angular/core';
import {TagService} from '../../services';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.css']
})
export class TagCloudComponent implements OnInit {

  constructor(private tagService: TagService) {
    this.tagService.list()
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
  }

}
