import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {
  constructor() {

  }

  urls:any={
        remoteServiceName : 'https://mooshare.azurewebsites.net/breeze/breeze/',
        apiServiceName : 'https://mooshare.azurewebsites.net/api/backend/',
        apiUploadServiceName : 'https://mooshare.azurewebsites.net/api/upload',
        appWebsiteUrl : 'http://app.pickpack.us'
  };

  entityType: any =
    {
        Profile: 'UserProfile',
        Contact: 'Contact',
        Email: 'Email',
        Phone:'Phone',
        Item:'Item',
        Friendship: 'Friendship',
        Registration: 'Registration'

    };

    resourceid:'Fashion';

    Name:any =
    {
        profiles: 'profiles',
        contacts: 'contacts',
        items:'items',
        friendships: 'friendships'

    };

    itemStatus:any = {
        draft:'Draft',
        available: 'Available',
        sold : 'Sold',
        deleted:'Deleted'
    };

    offerStatus:any = {
        offered: 'Offered',
        accepted : 'Accepted',
        rejected:'Rejected',
        revoked:'Revoked'
    };

    categories:any =
        [
            {id:'fashion',name:'Fashion',color:'blue',icon:'heart'},
            {id:'home',name:'Home & Decor',color:'purple',icon:'heart'},
            {id:'electronics',name:'Electronics',color:'green',icon:'heart'},
            {id:'baby',name:'Baby & Kids',color:'yellow',icon:'heart'},
            {id:'art',name:'Collections & Art',color:'orange',icon:'heart'},
            {id:'sports',name:'Sporting Goods',color:'main',icon:'heart'},
            {id:'auto',name:'Automobile',color:'pink',icon:'heart'},
            {id:'other',name:'Other stuff',color:'dpurple',icon:'heart'}
        ];
}