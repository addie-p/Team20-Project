### Description:
The Ranking System allows the user to navigate from the saved dashboard page to rate the restaurant by selecting stars out of 5 and writing a review. After clicking the Submit button, the rating and review are saved to IndexedDB. Additionally, users can use the navigation bar to navigate to other parts of the web app. This sequence diagram illustrates the interactions within the Ranking System Component.

## Sequence Diagram
```mermaid
   flowchart TD
    A[Rating System Page] -->|component| B[Restaurant name]
    A -->|component| C[Star rating selector]
    A -->|component| D[Text area for review]
    A -->|component| E[Submit button]
    A -->|component| F[Navigation]
    C -->|user selects stars| G[Update UI with user's star rating]
    D -->|user writes review| H[Update text state of review]
    E -->|save review and rating| I[Save to IndexedDB]
    I -->|confirm| J[Show success message or redirect]
    F -->|user selects page| K[Navigate to selected page]
```