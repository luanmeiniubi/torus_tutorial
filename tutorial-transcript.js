// tutorial-transcript.js

window.TUTORIAL_INDEX = [
  // ===== Set Up Your Course =====
  {
    title: "Course Author Page Overview",
    transcript: `Course Author Page Overview: This is the Course Author landing page. The Workspace menu on the left confirms you're in the Author role and lets you switch roles if needed. The main area lists all your projects (courses) so you can open any one quickly. To get started, create a new project.`
  },
  {
    title: "Create a New Project",
    transcript: `Create a New Project: Click "+ New Project", enter a name, and select "Create". Your course opens immediately so you can begin working. You can return any time by selecting its title from your projects list.`
  },
  {
    title: "Set Up Your Project (Course Overview)",
    transcript: `Set Up Your Project (Course Overview): When you open a course, you land on its Overview page. Here you set basic information and key settings.
- Project Title can be edited at any time.
- Add a Project Description to give context.`
  },
  {
    title: "Project Attributions",
    transcript: `Project Attributions: If you're designing or teaching in a language other than English, set the Learning Language.`
  },
  {
    title: "Project Labels",
    transcript: `Project Labels: Torus follows a default hierarchy of Units → Modules → Sections, where:
A Unit can contain multiple Modules
A Module can contain multiple Sections
(Units, Modules, and Sections can all contain Pages with course content.)
You can rename these containers to better fit your course structure. For example, if your course is structured by weeks, you can rename 'Units' to 'Weeks' to reflect the weekly progression of your lessons. If you are designing a language course, you can rename these structural containers in your target language.`
  },

  // ===== Develop Your Course =====
  {
    title: "Learning Objectives",
    transcript: `Learning Objectives: Learning objectives are the foundation of backward design and analysis. Attach objectives to pages and activities. See the CMU Eberly Center guide to learn why mapping objectives matters for student success.`
  },
  {
    title: "Create Learning Objective",
    transcript: `Create Learning Objective: Click "Create New Objective", enter the text, then select Create. The list shows each objective with counts for how many pages and activities use it.`
  },
  {
    title: "Create Sub-Learning Objectives",
    transcript: `Create Sub-Learning Objectives: Break a Learning Objective into sub-objectives to target the specific skills learners must master to achieve the higher-level goal.`
  },
  {
    title: "Activity Bank",
    transcript: `Activity Bank: Browse and reuse activities for practice or assessment aligned to your objectives.`
  },
  {
    title: "Curriculum: Edit Course Structure and Content",
    transcript: `Curriculum: Edit Course Structure and Content: Edit your course structure under Curriculum. The default hierarchy is Units → Modules → Sections (each can contain Pages). You can rename containers in Overview. Create a Unit via "Create a Unit"; Torus auto-numbers (e.g., "Unit 1: Unit") and updates when you reorder. Rename via Options → change title → Save. Create Modules and Sections inside their parents. You can create Pages at any level.`
  },
  {
    title: "Create Containers",
    transcript: `Create Containers: Create Units, Modules, and Sections using the Create controls. Use each container's Options menu to rename and manage it.`
  },
  {
    title: "Create a Page",
    transcript: `Create a Page: To add a page, choose "Practice" to create a new page. To add a page at a specific level, select the container and create it there. Practice Pages are unscored; Scored Pages are graded (assessments, checkpoints, exams). Icons distinguish Practice vs. Scored in the curriculum list.`
  },
  {
    title: "Practice Page Options",
    transcript: `Practice Page Options: Page titles appear in the structure and on the page. Change the title via Options → update and Save. A Practice Page defaults to "Unscored Practice Page". You can switch to "Scored Assessment" and configure scoring options. Remember to click Save in Page Options.`
  },
  {
    title: "Edit & Save Page",
    transcript: `Edit & Save Page: Click "Edit page" to author content. Torus auto-saves content while you edit—no save button needed for content changes.`
  },
  {
    title: "Edit Page Title",
    transcript: `Edit Page Title: The exception to auto-save is the Page Title: click "Edit Title", change it, then click Save.`
  },
  {
    title: "Add Learning Objectives in Page",
    transcript: `Add Learning Objectives in Page: At the top of each content page, select or create learning objectives. To map an existing objective, open the dropdown and check it. To create a new one, type in the bar and choose "Create new objective". Pages can have multiple objectives.`
  },
  {
    title: "Add Paragraph",
    transcript: `Add Paragraph: New pages start with a paragraph block ("Type here or use + to begin…"). Add text directly, or use the paragraph toolbar for formatting, images, tables, YouTube, etc. The + Insert Content handle shows where new content will go.`
  },
  {
    title: "Paragraph Toolbar",
    transcript: `Paragraph Toolbar: Click … More for underline, strikethrough, and subscript/superscript. Use the ¶ Format menu for lists, headings, and blockquotes. Use proper headings and list semantics for accessibility. Undo/Redo operates within the block.`
  },
  {
    title: "Paragraph Toolbar: Insert",
    transcript: `Paragraph Toolbar: Insert: Insert tables, images, and YouTube. For tables, use the cell menu (⋮) to add or delete rows/columns and mark header rows/columns for accessibility. For images, choose Image, update via Select Image, adjust size in Settings, and add meaningful alt text.`
  },
  {
    title: "Insert Content",
    transcript: `Insert Content: Content is authored in blocks. Use the horizontal + Insert Content control between blocks to add non-paragraph content such as questions.`
  },
  {
    title: "Add Multiple-Choice Questions (MCQ)",
    transcript: `Add Multiple-Choice Questions (MCQ): Insert MCQ via Insert Content → MCQ. Title the MCQ for authoring clarity (students don't see titles). Attach objectives to support analysis. Author the stem (rich formatting allowed), add choices, add or delete choices, and optionally shuffle order. Reorder with drag handles. In Answer Key, select the correct answer(s). Use CATA for multiple correct answers. Provide targeted feedback per choice; add general correct/incorrect feedback.`
  },
  {
    title: "Page Preview",
    transcript: `Page Preview: Use Preview to see the learner view. Validate answer correctness and feedback, confirm Content Break behavior, and check Back/Next navigation.`
  }
];
