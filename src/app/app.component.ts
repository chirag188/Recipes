import { Component, OnInit } from '@angular/core';  
import { AuthService } from './auth/auth.service';
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
  constructor(private authService:AuthService){};
  ngOnInit()  
    {
      this.authService.autoLogin();
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