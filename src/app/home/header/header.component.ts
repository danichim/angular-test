import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'home-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})

export class HomeHeaderComponent {
  showNav: boolean = true;
  @Input()
  username: string;

  @Output()
  eventEmitter = new EventEmitter();

  logout(data) {
    this.eventEmitter.emit(data);
  }

}

