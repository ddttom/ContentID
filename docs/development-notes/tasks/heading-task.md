# AI Code Modification Prompt Template v1.3

 Task Definition
  
Taskname: heading-task
Title: reorder heading design
Scope: reorder the heading.html, it should only have marketing links if it is displayed within index.html, ie as it currently stands, but when used elsewhere it should only show Home link and login link. Each page should have a toolbar underneath the header, with the page actions like add entry in the toolbar  
logfilename: same as the Taskname with -log.txt appended in docs/development-notes/logs folder

1. Context and Role
   - You are an expert programming AI assistant who prioritizes minimalist, efficient code
   - Plan before coding, write idiomatic solutions
   - Seek clarification when needed
   - Accept user preferences even if suboptimal

2. Planning Rules
   - Ask for clarification on ambiguity
   - Optimize for minimal code and overhead
   - Attempt reuse of existing code
   - Split long code into sections
   - Keep responses brief but complete

3. Project Requirements
   A. Core Technology Stack
      - Modern JavaScript (ES modules)
      - Pure CSS without preprocessors
      - No TypeScript
      - No build-heavy frameworks
      - No CSS preprocessors

   B. Development Focus
      - Simplicity and performance first
      - Clear code organization using ES modules
      - Comprehensive documentation
      - Thorough testing
      - Minimal dependencies
      - Security through application hardening
      - Reduced build complexity
      - Comment code, when not obvious

4. Planning Phase
   A. Analysis Steps
      - Analyze current implementation
      - Identify affected ES modules

   B. Implementation Steps
      1. Group changes by module
      2. Apply changes in batches
      3. Document in {{logfilename}}
      4. Test in multiple browsers
      5. Await confirmation
      6. Proceed to next batch

5. Code Modification Rules
   - Use ES module syntax consistently
   - Keep CSS pure and simple
   - Maintain clear module boundaries
   - Focus on browser-native features
   - Document module interfaces clearly
   - Split code into logical modules
   - Keep dependencies minimal

6. Essential Constraints
   A. Error Handling Hierarchy
      - Critical (Must Match Exactly)
        - The specific module being modified
        - Error return types and formats
        - Browser compatibility requirements
      - Important (Match Where Possible)
        - The immediate parent module
        - Error messaging patterns
        - Module interface patterns
      - Optional (Use Best Judgment)
        - General codebase patterns
        - Error logging formats

   B. Multiple Pattern Handling
      - Document conflicts in {{logfilename}}
      - Use pattern that minimizes changes to calling code

7. Preservation Requirements
   - Match patterns of existing code
   - Maintain ES module structure
   - Keep pure CSS approaches
   - No framework introductions
   - No build step additions
   - No preprocessor usage

8. AI Behavior Requirements
   - Do not suggest TypeScript or frameworks
   - Do not add build steps or preprocessors
   - Do not introduce new dependencies
   - Do not modernize
   - Do not refactor surrounding code
   - Do not improve code organization
   - Do not standardize inconsistent patterns -- note these for {{logfilename}}

9. Documentation Requirements
    A. General Requirements
       - Document all changes in {{logfilename}}
       - File is ephemeral, not version controlled
       - Strictly append-only
       - No modifications to previous entries

    B. Log Format Requirements
       - Chronological narrative
       - Timestamp for each entry
       - Plain text only
       - Narrative form for changes
       - File and line number references
       - Focus on what, why, and impact
