#import "AppDelegate.h"
#import "RNSplashScreen.h"  // Add this import
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MovieMate";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  BOOL ret = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  // Add this line to initialize the splash screen
  [RNSplashScreen show];
  
  return ret;
}

// Rest of your AppDelegate.m remains unchanged