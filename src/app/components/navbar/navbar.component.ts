import {Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild} from '@angular/core';
import {ButtonNameEnum} from "src/app/enums/ButtonNameEnum";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output("activeButton") activeButtonEvent = new EventEmitter<ButtonNameEnum>();
  @ViewChild("navButtons") navButtons!: ElementRef;
  eButtonName = ButtonNameEnum;

  constructor(private render: Renderer2) {
  }

  navButtonClick($event: MouseEvent, buttonName: ButtonNameEnum) {
    this.activeButtonEvent.emit(buttonName);
    this._setActiveLink($event);
  }

  /**
   * Сделать ссылку в navbar активной
   * @param $event
   * @private
   */
  private _setActiveLink($event: MouseEvent) {
    const children: HTMLCollection = this.navButtons.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      const href: Element | null = children.item(i);
      this.render.removeClass(href, "active");
    }
    const target = $event.target;
    this.render.addClass(target, "active");
  }
}
