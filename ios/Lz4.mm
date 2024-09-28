#import "Lz4.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import "../cpp/react-native-lz4.h"

using namespace facebook;

@implementation Lz4

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE(Lz4)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(getLz4VersionNumber:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(lz4::getLz4VersionNumber());

    resolve(result);
}

RCT_EXPORT_METHOD(getLz4VersionString:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    std::string versionString = lz4::getLz4VersionString();
    NSString *result = [NSString stringWithUTF8String:versionString.c_str()];

    resolve(result);
}

RCT_EXPORT_METHOD(compressFile:(NSString *)sourcePath
                  destinationPath:(NSString *)destinationPath
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    bool result = lz4::compressFile(sourcePath.UTF8String, destinationPath.UTF8String);

    resolve(@(result));
}

RCT_EXPORT_METHOD(decompressFile:(NSString *)sourcePath
                  destinationPath:(NSString *)destinationPath
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    bool result = lz4::decompressFile(sourcePath.UTF8String, destinationPath.UTF8String);

    resolve(@(result));
}


RCT_EXPORT_METHOD(initializeLz4)
{
  NSLog(@"Binding Lz4 to JSI");
  RCTBridge *bridge = [RCTBridge currentBridge];
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *) bridge;
  if (cxxBridge == nil) {
    NSLog(@"CxxBridge is nil");
  }
  if (cxxBridge.runtime == nil) {
    NSLog(@"Runtime is nil");
  }

  lz4::initializeLz4(*(jsi::Runtime *)cxxBridge.runtime);
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeLz4SpecJSI>(params);
}
#endif

@end
