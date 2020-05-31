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
  private solved = 0;

  private tasks: Task[] = [
    {
      id: 1,
      text: "5 + 3 = ?",
      location: {x: 58.67024, y: -0.9850892, z: 38.5934868,
        w1: 0.0411168337, w2: 0.8431884, w3: 0.0358040445, w4: 0.534846246},//-------
      answer: 8,
      hidden_at: {x: 71.11034, y: 3.54989314, z: 22.480835,
        w1: -0.09409681, w2: -0.102389425, w3: 0.05675846, w4: 0.988655865}//----
    },{
      id: 2,
      text: "5 - ? = 3",
      location: {x: 71.09433, y: -0.2241666, z: 44.76617,
        w1: 0.169331521, w2: 0.7257859, w3: -0.1875219, w4: 0.6398415},//---------
      answer: 2,
      hidden_at: {x: 44.36012, y: -0.416687, z: 43.4203339,
        w1: -0.03788799, w2: 0.781732857, w3: -0.0355880857, w4: -0.621443152}
    }, {
      id: 3,
      text: "20 - 14 = ?",
      location: {x: 83.45835, y: -1.38980973, z: 17.4695873,
        w1: 0.012424048, w2: 0.16545856, w3: -0.000035309, w4: -0.9861386},//-----
      answer: 6,
      hidden_at: {x: 59.15276, y: -0.113106847, z: 59.2892761,
        w1: -0.18222031, w2: 0.5058124, w3: 0.07235778, w4: 0.840067863}
    }, {
      id: 4,
      text: "81 - 77 = ?",
      location: {x: 67.21686, y: -3.219486, z: 61.88564,
        w1: 0.266013682, w2: -0.6834495, w3: 0.611422, w4: 0.297148},//-------
      answer: 4,
      hidden_at: {x: 71.36843, y: -3.71272182, z: 44.74079,
        w1: -0.699817836, w2: 0.0272686183, w3: 0.07349601, w4: 0.710006952}// ----
    }, {
      id: 5,
      text: "21 / ? = 3",
      location: {x: 51.30868, y: -1.30360162, z: 56.66655,
        w1: 0.1486312, w2: 0.4076726, w3: 0.0176285431, w4: 0.900777936},// ---------
      answer: 7,
      hidden_at: {x: 72.59961, y: 3.225022, z: 109.116035,
        w1: 0.435936868, w2: 0.05325961, w3: 0.02766049, w4: 0.897974133}//---
    }, {
      id: 6,
      text: "? x 9 = 81",
      location: {x: 60.61909, y: -0.179195821, z: 21.5244064,
        w1: 0.0442890823, w2: -0.3969097, w3: 0.0149502456, w4: 0.916666567},//----
      answer: 9,
      hidden_at: {x: 51.80383, y: 2.79448175, z: 17.07348,
        w1: -0.0765810758, w2: 0.329277128, w3: 0.0685987, w4: 0.9386193}
    }, {
      id: 7,
      text: "? x 8 = 0",
      location: {x: 71.48281, y: -0.265115619, z: 44.6869,
        w1: 0.199391931, w2: -0.628774762, w3: 0.218982875, w4: 0.718979836},// ----------
      answer: 0,
      hidden_at: {x: 69.2272644, y: -3.16664052, z: 68.6573,
        w1: -0.24994877, w2: 0.5544528, w3: 0.159729958, w4: 0.7775566}// ----
    }, {
      id: 8,
      text: "127 / 127 = ?",
      location: {x: 87.74715, y: 0.289908081, z: 43.5370674,
        w1: 0.2859625, w2: 0.2740415, w3: -0.0708112344, w4: 0.915484846},//-------
      answer: 1,
      hidden_at: {x: 60.3925858, y: -2.984619, z: 33.5966644,
        w1: -0.679051638, w2: -0.179448277, w3: -0.180432111, w4: 0.68857193} // ---
    }, {
      id: 9,
      text: "125 / ? = 25",
      location: {x: 86.14557, y: 3.31004858, z: 69.58802,
        w1: 0.248535067, w2: 0.217179328, w3: -0.0520688556, w4: 0.942524433},//----
      answer: 5,
      hidden_at: {x: 74.023, y: -2.996942, z: 62.0287476,
        w1: -0.00702901464, w2: 0.999316, w3: -0.017021209, w4: 0.03206515} // --
    }, {
      id: 10,
      text: "-12 + 15 = ?",
      location: {x: 54.72557, y: -0.33409968, z: 41.15714,
        w1: -0.00831335, w2: -0.7093594, w3: -0.00372094475, w4: 0.7047881},//----------
      answer: 3,
      hidden_at: {x: 94.48594, y: -2.32761574, z: 54.96087,
        w1: -0.2054519, w2: 0.8096815, w3: 0.2908177, w4: 0.4665088}// ---
    }];


  
	constructor(private context: MRE.Context, private baseUrl: string) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
    this.assets = new MRE.AssetContainer(this.context);


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
      MRE.log.info("app","Created task: " + task.id);
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
          this.solved++;
          numberActor.destroy();
          MRE.log.info("app", user.name +" solved task " + task.id + ", total solved: " + this.solved);


          if(this.solved >= 10){
            user.prompt("Alla utmaningar är lösta!!!", false);
            MRE.log.info("app", "All tasks are solved!!");
          }
        }
        /*
        console.log("Answer "+ task.id + ":");
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
      /*
      numberActor.collider.onCollision("collision-enter", (data: MRE.CollisionData) => {
        console.log("collision");
        console.log(data);
        MRE.log.info("app","number collided with: " + data.otherActor.name);
      });*/

    }
    
  }
}
