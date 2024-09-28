#import "Lz4.h"
#import <React/RCTBridge+Private.h>

using namespace facebook;

@implementation Lz4
RCT_EXPORT_MODULE(Lz4)

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_METHOD(initializeLz4)
{
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
