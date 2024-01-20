import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-exchange-input',
  templateUrl: './exchange-input.component.html',
  styleUrls: ['./exchange-input.component.css']
})
export class ExchangeInputComponent {
  @Output("loaded") loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
}
