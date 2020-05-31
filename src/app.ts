/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';


type Pose = {
  x: number;
  y: number;
  z: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
};

type Task = {
  id: number;
	text: string;
	location: Pose;
	answer: number;
	hidden_at: Pose;
};



/**
 * The main class of this app. All the logic goes here.
 */
export default class MathGame {
	//private text: MRE.Actor = null;
  //private numberActor: MRE.Actor = null;
	private assets: MRE.AssetContainer;

  private tasks: Task[] = [
    {
      id: 1,
      text: "5+3=?",
      location: {x: 54.85337, y: -1.15365648, z: 45.6537056,
        w1: -0.0110018291, w2: 0.685830235, w3: -0.0102997953, w4: -0.7276055},
      answer: 8,
      hidden_at: {x: 51.80383, y: 2.79448175, z: 17.07348,
        w1: -0.0765810758, w2: 0.329277128, w3: 0.0685987, w4: 0.9386193}
    },{
      id: 2,
      text: "5-2=?",
      location: {x: 70.53454, y: -1.14661682, z: 44.6848679,
        w1: 0.181157038, w2: 0.7199557, w3: -0.234254554, w4: 0.627670944},
      answer: 3,
      hidden_at: {x: 44.36012, y: -0.416687, z: 43.4203339,
        w1: -0.03788799, w2: 0.781732857, w3: -0.0355880857, w4: -0.621443152}
    }, {
      id: 3,
      text: "20-14=?",
      location: {x: 54.7163925, y: -0.4324018, z: 41.2453537,
        w1: -0.0109141469, w2: -0.6985699, w3: -0.0150217041, w4: 0.7153009},
      answer: 6,
      hidden_at: {x: 59.15276, y: -0.113106847, z: 59.2892761,
        w1: -0.18222031, w2: 0.5058124, w3: 0.07235778, w4: 0.840067863}
    }];


  
	constructor(private context: MRE.Context, private baseUrl: string) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
    this.assets = new MRE.AssetContainer(this.context);
    //console.log('count: %d', 134631);
    //console.log('{x: %f, y: %f, z: %f, w1: %f, w2: %f, w3: %f, w4: %f}',1,2,3,4,5,6,7);

    for (let task of this.tasks) {

      // Create a new actor with no mesh, but some text.
      let textActor = MRE.Actor.Create(this.context, {
        actor: {
          name: "task-"+task.id,
          collider: {
            enabled: true,
            geometry: {
              shape: MRE.ColliderType.Box
            }
          },
          transform: {
            app: {
              position: { x: task.location.x, y: task.location.y, z: task.location.z },
              rotation: { x: task.location.w1, y: task.location.w2, z: task.location.w3, w: task.location.w4 }
            }
          },
          text: {
            contents: task.text,
            anchor: MRE.TextAnchorLocation.TopCenter,
            color: { r: 0.1, g: 0.1, b: 0.1 },
            height: 0.4
          }
        }
      });
      /*
      textActor.grabbable = true;
      textActor.subscribe('transform');
      textActor.onGrab("end", (user) => {
        console.log("Text "+ task.id + ":");
        console.log('{x: %f, y: %f, z: %f,\n w1: %f, w2: %f, w3: %f, w4: %f}',
          textActor.transform.app.position.x,
          textActor.transform.app.position.y,
          textActor.transform.app.position.z,
          textActor.transform.app.rotation.x,
          textActor.transform.app.rotation.y,
          textActor.transform.app.rotation.z,
          textActor.transform.app.rotation.w)
      });
      */

      // Load a glTF model
      let numberActor = MRE.Actor.CreateFromGltf(this.assets, {
        // at the given URL
        uri: `${this.baseUrl}/${task.answer}.gltf`,
        // and spawn box colliders around the meshes.
        colliderType: 'box',
        // Also apply the following generic actor properties.
        actor: {
          name: 'answer-to-task-'+task.id,
          //subscriptions: ['transform', 'collider'],
          collider: {
            enabled: true,
            geometry: {
              shape: MRE.ColliderType.Auto
            }
          },
          // Parent the glTF model to the text actor.
          //parentId: textActor.id,
          transform: {
            app: {
              position: { x: task.hidden_at.x, y: task.hidden_at.y, z: task.hidden_at.z },
              rotation: { x: task.hidden_at.w1, y: task.hidden_at.w2, z: task.hidden_at.w3, w: task.hidden_at.w4 }
            },
            local: {
              scale: { x: 0.01, y: 0.01, z: 0.01 }
            }
          }
        }
      });
      MRE.log.info("app","created: " + task.answer);
      //numberActor.setCollider(MRE.ColliderType.Auto, false);

      numberActor.subscribe('transform');
      numberActor.grabbable = true;
      numberActor.onGrab("end", (user) => {
        //user.prompt("Hämta siffran som saknas: 5 + ? = 14", true).then(resp => {
        //  console.log("Klickade " + (resp.submitted?"OK":"Cancel") + (resp.text?(", med texten " + resp.text):""));
        //});

        if (MRE.Vector3.Distance(textActor.transform.app.position, numberActor.transform.app.position) < 1.0){
          textActor.text.contents = textActor.text.contents.replace("?", task.answer.toString()) + "\n Rätt!!";
          textActor.text.color = { r: 0.1, g: 0.7, b: 0.1 };
          numberActor.destroy();
          MRE.log.info("app", user.name +" solved task " + task.id);
        }
        
        /*console.log("Answer "+ task.id + ":");
        console.log('{x: %f, y: %f, z: %f,\n w1: %f, w2: %f, w3: %f, w4: %f}',
          numberActor.transform.app.position.x,
          numberActor.transform.app.position.y,
          numberActor.transform.app.position.z,
          numberActor.transform.app.rotation.x,
          numberActor.transform.app.rotation.y,
          numberActor.transform.app.rotation.z,
          numberActor.transform.app.rotation.w)
        */
      });
      numberActor.collider.onCollision("collision-enter", (data: MRE.CollisionData) => {
        console.log("collision");
        console.log(data);
        MRE.log.info("app","number collided with: " + data.otherActor.name);
      })

    }
    
  }
}
