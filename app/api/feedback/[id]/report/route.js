import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { authMiddleware } from "@/middleware/authMiddleware";
import PDFDocument from "pdfkit";

function generatePDF(interview) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const scores = interview.scores || {};
    const scoreMap =
      typeof scores.get === "function"
        ? scores
        : new Map(Object.entries(scores));

    const performanceMetrics = [
      { label: "Communication Skills", value: scoreMap.get?.("communication") ?? null },
      { label: "Technical Knowledge", value: scoreMap.get?.("technical") ?? null },
      { label: "Confidence Level", value: scoreMap.get?.("confidence") ?? null },
      { label: "Problem Solving", value: scoreMap.get?.("problemSolving") ?? null },
      { label: "Speaking Speed", value: scoreMap.get?.("speakingSpeed") ?? null },
      { label: "Eye Contact", value: scoreMap.get?.("eyeContact") ?? null },
    ].filter((m) => m.value != null);

    const W = doc.page.width - 100;
    let y = 50;

    // Header
    doc.fontSize(24).font("Helvetica-Bold").fillColor("#0a0a0f").text("Interview Feedback Report", 50, y);
    y += 35;
    doc.fontSize(12).font("Helvetica").fillColor("#6b6a7a");
    doc.text(`Company: ${interview.company || "General"}`, 50, y);
    doc.text(`Role: ${interview.role || "Software Engineer"}`, 50, y + 16);
    doc.text(
      `Date: ${interview.date ? new Date(interview.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}`,
      50,
      y + 32
    );
    if (interview.duration) {
      doc.text(`Duration: ${interview.duration} min`, 50, y + 48);
    }
    y += 80;

    // Overall Score
    if (interview.overallScore != null) {
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0a0a0f").text("Overall Score", 50, y);
      y += 25;
      doc.fontSize(36).font("Helvetica-Bold").fillColor("#8B5CF6").text(`${interview.overallScore}%`, 50, y);
      y += 45;
    }

    // Performance Metrics
    if (performanceMetrics.length > 0) {
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0a0a0f").text("Performance Metrics", 50, y);
      y += 25;

      for (const m of performanceMetrics) {
        doc.fontSize(11).font("Helvetica").fillColor("#0a0a0f").text(m.label, 50, y);
        doc.fontSize(11).font("Helvetica-Bold").fillColor("#8B5CF6").text(`${m.value}%`, W + 30, y, { align: "right" });
        y += 18;

        // Progress bar background
        doc.rect(50, y, W, 8).fill("#f0eeff");
        // Progress bar fill
        doc.rect(50, y, (W * m.value) / 100, 8).fill("#8B5CF6");
        y += 22;
      }
    }

    // Strengths
    if (interview.strengths?.length > 0) {
      y += 10;
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0a0a0f").text("Strengths", 50, y);
      y += 25;
      for (const s of interview.strengths) {
        doc.fontSize(11).font("Helvetica").fillColor("#22C55E").text(`✓ ${s}`, 50, y);
        y += 18;
      }
    }

    // Weaknesses
    if (interview.weaknesses?.length > 0) {
      y += 10;
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0a0a0f").text("Areas for Improvement", 50, y);
      y += 25;
      for (const w of interview.weaknesses) {
        doc.fontSize(11).font("Helvetica").fillColor("#F59E0B").text(`○ ${w}`, 50, y);
        y += 18;
      }
    }

    // AI Suggestions
    if (interview.aiSuggestions?.length > 0) {
      y += 10;
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0a0a0f").text("AI Suggestions", 50, y);
      y += 25;
      for (const s of interview.aiSuggestions) {
        doc.fontSize(11).font("Helvetica").fillColor("#6b6a7a").text(`• ${s}`, 50, y, { width: W });
        y += 20;
        if (y > doc.page.height - 80) {
          doc.addPage();
          y = 50;
        }
      }
    }

    // Question Feedback
    if (interview.questionFeedback?.length > 0) {
      y += 10;
      doc.addPage();
      y = 50;
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0a0a0f").text("Question Feedback", 50, y);
      y += 30;

      for (let i = 0; i < interview.questionFeedback.length; i++) {
        const qf = interview.questionFeedback[i];
        if (y > doc.page.height - 100) {
          doc.addPage();
          y = 50;
        }
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#0a0a0f").text(`Q${i + 1}: ${qf.question || ""}`, 50, y, { width: W });
        y += 20;
        if (qf.score != null) {
          doc.fontSize(11).font("Helvetica").fillColor("#8B5CF6").text(`Score: ${qf.score}%`, 50, y);
          y += 16;
        }
        if (qf.userAnswer) {
          doc.fontSize(10).font("Helvetica-Oblique").fillColor("#6b6a7a").text(`Your Answer: ${qf.userAnswer}`, 50, y, { width: W });
          y += 18;
        }
        if (qf.aiFeedback) {
          doc.fontSize(10).font("Helvetica").fillColor("#6b6a7a").text(`Feedback: ${qf.aiFeedback}`, 50, y, { width: W });
          y += 18;
        }
        if (qf.correctApproach) {
          doc.fontSize(10).font("Helvetica").fillColor("#22C55E").text(`Correct Approach: ${qf.correctApproach}`, 50, y, { width: W });
          y += 18;
        }
        y += 12;
      }
    }

    // Footer
    const pageCount = doc.bufferedPageRange
      ? doc.bufferedPageRange().count
      : 1;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#a0a0b0")
        .text(
          `Generated by AI Mock Interview | Page ${i + 1} of ${pageCount}`,
          50,
          doc.page.height - 40,
          { align: "center", width: doc.page.width - 100 }
        );
    }

    doc.end();
  });
}

export async function GET(req, { params }) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const interview = await Interview.findOne({
      _id: id,
      userId: authResult.userId,
    }).lean();

    if (!interview) {
      return Response.json(
        { success: false, message: "Interview not found" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generatePDF(interview);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="interview-feedback-${id}.pdf"`,
        "Content-Length": pdfBuffer.length,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
