import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rezept-card',
  templateUrl: './rezept-card.component.html',
  styleUrls: ['./rezept-card.component.css']
})
export class RezeptCardComponent {
  @Input() public obj: any
}
