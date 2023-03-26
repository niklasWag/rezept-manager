import { Component, Input } from '@angular/core';
import { Rezept } from 'kern-util/lib/domain';

@Component({
  selector: 'app-rezept-card',
  templateUrl: './rezept-card.component.html',
  styleUrls: ['./rezept-card.component.css']
})
export class RezeptCardComponent {
  @Input() public rezept!: Rezept
}
