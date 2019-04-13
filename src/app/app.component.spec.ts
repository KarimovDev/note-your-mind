import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(
            AppComponent
        );
        const app: AppComponent = fixture.debugElement.componentInstance;

        expect(app).toBeTruthy();
    });

    it(`should have as title 'note-your-mind'`, () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(
            AppComponent
        );
        const app: AppComponent = fixture.debugElement.componentInstance;

        expect(app.title).toEqual('note-your-mind');
    });

    it('should render title in a h1 tag', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(
            AppComponent
        );

        fixture.detectChanges();

        const compiled: Element = fixture.debugElement.nativeElement;

        expect(compiled.querySelector('h1').textContent).toContain(
            'Welcome to note-your-mind!'
        );
    });
});
