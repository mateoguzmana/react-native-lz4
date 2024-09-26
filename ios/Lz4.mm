#import "Lz4.h"

@implementation Lz4
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(lz4::multiply(a, b));

    resolve(result);
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

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeLz4SpecJSI>(params);
}
#endif

@end
