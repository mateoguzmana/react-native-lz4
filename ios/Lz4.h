#ifdef __cplusplus
#import "react-native-lz4.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNLz4Spec.h"

@interface Lz4 : NSObject <NativeLz4Spec>
#else
#import <React/RCTBridgeModule.h>

@interface Lz4 : NSObject <RCTBridgeModule>
#endif

@end
