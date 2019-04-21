import { Component, Input } from '@angular/core';
import { ConnectedTaskCards } from 'src/app/models/connected-task-cards';

@Component({
  selector: 'nym-line-draw',
  templateUrl: './line-draw.component.html',
  styleUrls: ['./line-draw.component.scss']
})
export class LineDrawComponent {
    @Input() public connectedTaskCards: ConnectedTaskCards[];
}
