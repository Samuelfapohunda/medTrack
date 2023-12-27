// reminderScheduler.ts
import cron from 'node-cron';
import twilio from 'twilio';
import { Reminder } from '../models/Reminder';
import { Medication } from '../models/Medication';
// import { User } from '../models/User';




export function startReminderScheduler(): void {
  cron.schedule('* * * * *', async () => { 
    console.log('Scheduled task is running...');
  
    try {
      const currentDateTime = new Date();
      currentDateTime.setMilliseconds(0); // Set milliseconds to zero

      // Fetch all medications with their respective reminder intervals
      const medications = await Medication.find();
      // const reminders = await Reminder.find();
      // const user = await User.find()
       
      // Process reminders for each medication
      for (const medication of medications) { 
        const dueReminders = await Reminder.find({
          medication: medication._id,
          dueAt: { $lte: currentDateTime },
          // createdBy: user._id
        }).populate('medication');

        // Check if there are due reminders
        if (dueReminders.length > 0) {
          dueReminders.forEach((reminder) => {
            console.log(`It is time for your ${reminder.medication.medicationName} dosage`);
          });
        } else {
          // If no due reminders, schedule the next reminder based on the medication's interval
          const nextDueTime = calculateNextDueTime(currentDateTime, medication.interval);
          

          // Create a new reminder for the next due time

          const newReminder = new Reminder({ 
            medication: medication._id,
            dueAt: nextDueTime,
            createdBy: medication.createdBy
          });

          await newReminder.save();
          console.log(`Next reminder scheduled for ${medication.medicationName} at ${nextDueTime}`);
        }
      };
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  });
}

function calculateNextDueTime(currentTime: Date, interval: number): Date {
  const nextDueTime = new Date(currentTime.getTime() + interval * 60 * 60 * 1000);
  return nextDueTime;
}


// export function startReminderScheduler(): void {
//   cron.schedule('* * * * *', async () => {
//     console.log('Scheduled task is running...');
  
//     try {
//       const currentDateTime = new Date();
//       currentDateTime.setMilliseconds(0);

//       // Fetch all medications with their respective reminder intervals
//       const medications = await Medication.find();
      
//       // Process reminders for each medication
//       for (const medication of medications) {
//         console.log(`Processing medication: ${medication.medicationName}`);

//         const dueReminders = await Reminder.find({
//           medication: medication._id,
//           dueAt: { $lte: currentDateTime }
//         }).populate('medication');

//         // Check if there are due reminders
//         if (dueReminders.length > 0) {
//           dueReminders.forEach((reminder) => {
//             console.log(`It is time for your ${reminder.medication.medicationName} dosage`);
//           });
//           continue;
//         } else {
//           // If no due reminders, schedule the next reminder based on the medication's interval
//           const nextDueTime = calculateNextDueTime(currentDateTime, medication.interval);

//           // Create a new reminder for the next due time
//           const newReminder = new Reminder({ 
//             medication: medication._id,
//             dueAt: nextDueTime,
//             createdBy: medication.createdBy
//           });

//           await newReminder.save();
//           console.log(`Next reminder scheduled for ${medication.medicationName} at ${nextDueTime}`);
//         }
//       }

//       // Introduce a delay before the next iteration of the cron job
//       await delay(1000); // Adjust the delay as needed (e.g., 1000 ms = 1 second)
//     } catch (error) {
//       console.error('Error processing reminders:', error);
//     }
//   });
// }

// function calculateNextDueTime(currentTime: Date, interval: number): Date {
//   const nextDueTime = new Date(currentTime.getTime() + interval * 60 * 60 * 1000);
//   return nextDueTime;
// }

// async function delay(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }


// export function startReminderScheduler(): void {
//   cron.schedule('* * * * *', async () => {
//     console.log('Scheduled task is running...');

//     try {
//       const currentDateTime = new Date();
//       currentDateTime.setMilliseconds(0);

//       // Fetch all medications with their respective reminder intervals
//       const medications = await Medication.find();

//       for (const medication of medications) {
//         const dueReminders = await Reminder.find({
//           medication: medication._id,
//           dueAt: { $lte: currentDateTime },
//         }).populate('medication');

//         if (dueReminders.length > 0) {
//           // If there are due reminders, process them and move to the next medication
//           dueReminders.forEach((reminder) => {
//             console.log(`It is time for your ${reminder.medication.medicationName} dosage`);
//           });
//         } else {
//           // If no due reminders, schedule the next reminder based on the medication's interval
//           const nextDueTime = calculateNextDueTime(currentDateTime, medication.interval);

//           // Check if a reminder already exists for this medication at the calculated time
//           const existingReminder = await Reminder.findOne({
//             medication: medication._id,
//             dueAt: nextDueTime,
//           });

//           if (!existingReminder) {
//             // Create a new reminder for the next due time
//             const newReminder = new Reminder({
//               medication: medication._id,
//               dueAt: nextDueTime,
//               createdBy: medication.createdBy,
//             });

//             await newReminder.save();
//             console.log(`Next reminder scheduled for ${medication.medicationName} at ${nextDueTime}`);
//           } else {
//             console.log(`Reminder already exists for ${medication.medicationName} at ${nextDueTime}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error processing reminders:', error);
//     }
//   });
// }

// function calculateNextDueTime(currentTime: Date, interval: number): Date {
//   const nextDueTime = new Date(currentTime.getTime() + interval * 60 * 60 * 1000);
//   return nextDueTime;
// }