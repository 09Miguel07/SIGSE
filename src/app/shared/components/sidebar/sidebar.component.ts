import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../layout/layout.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [RouterLink, RouterLinkActive]
})
export class SidebarComponent {
  items     = input.required<NavItem[]>();
  collapsed = input<boolean>(false);
  toggle    = output<void>();
  logout    = output<void>();
}
