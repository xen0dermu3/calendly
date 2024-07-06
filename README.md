# Mini Calendly App

[Original](https://meowing-ceres-b53.notion.site/Mini-Calendly-App-7bcb17d34e644d97bb9d69d3aff3df90)

Please create an app which will satisfy next business logic.

I am John, I am CEO of Tech Company, and I want to have One-to-One sessions with my employees. To make sure that I will find this time I need to book slots in my agenda.

I want to have possibility to choose from Monday to Friday my free spots, and depending on selected spots system should generate available slots for my employees.

```jsx
I pick 12:00 - 14:00 and step(duration) 15 min for Monday;
I pick 16:00 - 18:00 and step(duration) 30 min for Friday;

for rest of the days, it should be impossible to select any spot.

// When employee select date for example 1 July 2024 (Monday) he will see next
// available spots

12:00 12:15 12:30 12:45 13:00 13:15 13:30 13:45

// When employee select date for example 5 July 2024 (Friday) he will see next
// available spots

16:00 16:30 17:00 17:30
```

1. When employee select date & free spot, I should receive a notification via email and also google calendar event.
   _Hints: ical file should be attached in my email notification_
2. Selected spot should be eliminated from list, for avoiding overlapping.
3. In case if all spots are occupied for selected days, let’s have an additional endpoint which will sugerate the nears free slot for user
   _(Ex: In case if my schedule is occupied for 2 weeks from 1 Jul to 14 Jul, and user select 5 Jul then the nears slot will be 12:00 for 15 Jul)_

---

**From technical point of view:**

- Solution should be on NestJS Framework
- PostgresSQL & TypeORM
- DTO Validations
- Documentation
