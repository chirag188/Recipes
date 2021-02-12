import { Component, OnInit } from '@angular/core';  
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as fromApp from './app.reducer';
import * as AuthActions from './auth/auth.reducer';
// import { IpServiceService } from './ip-service.service';  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {  
  loadedFeature = 'recipe';
  // onNavigate(feature:string){
  //   this.loadedFeature = feature;
  // constructor(private ip:IpServiceService){}  
  // ipAddress!:string;  
  // title = 'DemoApp';  
  constructor(private authService:AuthService,private store:Store<fromApp.AppState>){};
  ngOnInit()  
    {
      // this.authService.autoLogin();
      this.store.dispatch(new AuthActions.AutoLogin());
      // this.getIP();  
    }  
    // getIP()  
    // {  
    //   this.ip.getIPAddress().subscribe((res:any)=>{  
    //     this.ipAddress=res.ip;  
    //   });  
    //}  
  // }
}