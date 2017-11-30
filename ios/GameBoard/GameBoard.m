//
//  GameBoard.m
//  SquareInTheAir
//
//  Created by Daniel Abdelsamed on 11/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <SpriteKit/SpriteKit.h>
#import <React/RCTViewManager.h>

@interface RNTGameBoardManager : RCTViewManager
@end

@implementation RNTGameBoardManager

RCT_EXPORT_MODULE()

CGFloat SIZE = 50;

NSMutableArray<SKShapeNode *> *squares;

- (UIView *)view
{
  //[self addSquare];
  CGFloat width = [UIScreen mainScreen].bounds.size.width;
  CGFloat height = [UIScreen mainScreen].bounds.size.height;
  
  CGRect mainSize = CGRectMake(0,0,width,height);
  
  
  
  SKView *gameBoard = (SKView *)self.view;
  [gameBoard setShowsFPS:YES];
  [gameBoard setShowsPhysics:YES];
  [gameBoard setFrame:mainSize];
  
  SKScene *mainScene = [SKScene sceneWithSize:gameBoard.bounds.size];
  mainScene.backgroundColor = [UIColor blueColor];
  mainScene.scaleMode = SKSceneScaleModeAspectFill;
  
//  for(SKShapeNode *square in squares){
//    [mainScene addChild:square];
//  }
  
  [gameBoard presentScene:mainScene];
  
  UIView *mainView = [[UIView alloc] initWithFrame:mainSize];
  [mainView addSubview:gameBoard];
  
  return mainView;
}

-(void) addSquare
{
  SKShapeNode *mainShape = [SKShapeNode shapeNodeWithRect:CGRectMake(0, 0, SIZE, SIZE)];
  
  CGFloat red = (arc4random_uniform(255) / 255.0)*0.8+0.2;
  CGFloat green = (arc4random_uniform(255) / 255.0)*0.8+0.2;
  CGFloat blue = (arc4random_uniform(255) / 255.0)*0.8+0.2;
  
  mainShape.fillColor = [UIColor colorWithRed:red green:green blue:blue alpha:1];
  
  SKPhysicsBody *physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:CGSizeMake(SIZE, SIZE)];
  [physicsBody setAffectedByGravity:NO];
  
  mainShape.physicsBody = physicsBody;
  
  [mainShape setPosition:CGPointMake(200, 200)];
  
  [squares addObject:mainShape];
}

@end
