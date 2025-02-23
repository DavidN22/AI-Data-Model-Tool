import { Modal } from "./Modal";

export const HowToUseModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal title="How to Use" onClose={onClose}>
      <div>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            Talk with the AI and discuss the type of project and{" "}
            <strong>SQL model</strong> you would like.
          </li>
          <li>
            The AI will then respond in <strong>text format</strong> of the{" "}
            <strong>SQL design</strong>.
          </li>
          <li>
            If you are happy with the current design model that the AI
            generated, press the <strong>Generate Data Model</strong> button,
            and your <strong>SQL model</strong> should appear.
          </li>
          <li>
            More advanced features like the <strong>Switch to Input</strong>{" "}
            allow you to create your own tables and <strong>merge</strong> them
            with an already active AI model.
          </li>
          <li>
            Pressing the <strong>SQL</strong> button on the top right of a table
            will show the SQL string of the table.
          </li>
        </ol>
        <p className="mt-6 text-gray-600 text-sm">
          If you want full control over the project, visit this{" "}
          <a
            href="https://github.com/DavidN22/AI-Data-Model-Tool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium underline hover:text-blue-800"
          >
            GitHub link
          </a>
          , clone the repo, and follow the README on how to get started. Happy
          building!
        </p>
      </div>
    </Modal>
  );
};
