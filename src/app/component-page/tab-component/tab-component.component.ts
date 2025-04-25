import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {highlightAll} from '@speed-highlight/core';

@Component({
  selector: 'app-tab-component',
  templateUrl: './tab-component.component.html',
  styleUrl: './tab-component.component.css'
})
export class TabComponentComponent implements AfterViewInit {
  editor = ' <Tabs type="solid" stretch selected="1">\n' +
    '         <TabItem value="1">\n' +
    '           <div class="flex space-x-2 justify-center items-center">\n' +
    '             <i class="material-icons text-xl">preview</i>\n' +
    '             <span>Preview More</span>\n' +
    '           </div>\n' +
    '         </TabItem>\n' +
    '         <TabItem value="2">\n' +
    '           <div class="flex space-x-2 justify-center items-center">\n' +
    '             <i class="material-icons text-xl">preview</i>\n' +
    '             <span>Preview More</span>\n' +
    '           </div>\n' +
    '         </TabItem>\n' +
    '         <TabItem value="3">\n' +
    '          <div class="flex space-x-2 justify-center items-center">\n' +
    '            <i class="material-icons text-xl">preview</i>\n' +
    '            <span>Preview More</span>\n' +
    '          </div>\n' +
    '         </TabItem>\n' +
    '       </Tabs>';


  @ViewChild('codePoint', {static: true}) codePoint!: ElementRef<HTMLElement>;

  selected = 1;
  ngAfterViewInit(): void {
    highlightAll({hideLineNumbers: false});
  }

}
