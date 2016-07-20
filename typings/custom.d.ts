interface Window {
   cordova:any;
   plugins:any;
}

declare var window: Window;
declare module 'window' {
	export = window;
}


interface /*PhoneGapNavigator extends*/ Navigator {
    app: any;
}

declare var navigator: Navigator;
declare module 'navigator' {
	export = navigator;
}

