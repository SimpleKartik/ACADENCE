const mongoose = require('mongoose');
const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { sendEmail } = require('../utils/sendEmail');

/**
 * Create Book (Admin only)
 * POST /api/library/books
 */
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, totalCopies } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (!author || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Author is required',
      });
    }

    if (!isbn || !isbn.trim()) {
      return res.status(400).json({
        success: false,
        message: 'ISBN is required',
      });
    }

    if (!totalCopies || totalCopies < 1) {
      return res.status(400).json({
        success: false,
        message: 'Total copies must be at least 1',
      });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn: isbn.trim().toUpperCase() });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists',
      });
    }

    // Create book
    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim().toUpperCase(),
      totalCopies,
      availableCopies: totalCopies,
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: {
        book,
      },
    });
  } catch (error) {
    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists',
      });
    }
    next(error);
  }
};

/**
 * Update Book (Admin only)
 * PUT /api/library/books/:id
 */
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, totalCopies } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Update fields
    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (isbn) {
      // Check if new ISBN already exists
      const existingBook = await Book.findOne({
        isbn: isbn.trim().toUpperCase(),
        _id: { $ne: id },
      });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: 'Book with this ISBN already exists',
        });
      }
      book.isbn = isbn.trim().toUpperCase();
    }

    if (totalCopies !== undefined) {
      if (totalCopies < 1) {
        return res.status(400).json({
          success: false,
          message: 'Total copies must be at least 1',
        });
      }

      // Calculate difference and adjust available copies
      const diff = totalCopies - book.totalCopies;
      book.totalCopies = totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: {
        book,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists',
      });
    }
    next(error);
  }
};

/**
 * Get All Books (Admin only)
 * GET /api/library/books
 */
const getAllBooks = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    // Get books with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Issue Book (Admin only)
 * POST /api/library/issue
 */
const issueBook = async (req, res, next) => {
  try {
    const { bookId, studentId } = req.body;
    const adminId = req.user._id;

    // Validate input
    if (!bookId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and Student ID are required',
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if book is available
    if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: 'No copies available for this book',
      });
    }

    // Find student by ID, email, or roll number
    let student;
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      student = await Student.findById(studentId);
    } else {
      // Try email or roll number
      student = await Student.findOne({
        $or: [
          { email: studentId.toLowerCase().trim() },
          { rollNumber: studentId.trim().toUpperCase() },
        ],
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found. Please check the email or roll number.',
      });
    }

    // Check if student already has this book issued
    const existingIssue = await BookIssue.findOne({
      book: bookId,
      student: student._id,
      status: { $in: ['ISSUED', 'OVERDUE'] },
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: 'Student already has this book issued',
      });
    }

    // Calculate due date (14 days from now)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create book issue
    const bookIssue = await BookIssue.create({
      book: bookId,
      student: student._id,
      issuedBy: adminId,
      issueDate,
      dueDate,
      status: 'ISSUED',
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    // Populate references
    await bookIssue.populate('book', 'title author isbn');
    await bookIssue.populate('student', 'name email rollNumber');
    await bookIssue.populate('issuedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      data: {
        bookIssue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return Book (Admin only)
 * POST /api/library/return
 */
const returnBook = async (req, res, next) => {
  try {
    const { issueId } = req.body;

    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: 'Issue ID is required',
      });
    }

    // Find book issue
    const bookIssue = await BookIssue.findById(issueId).populate('book');

    if (!bookIssue) {
      return res.status(404).json({
        success: false,
        message: 'Book issue not found',
      });
    }

    if (bookIssue.status === 'RETURNED') {
      return res.status(400).json({
        success: false,
        message: 'Book has already been returned',
      });
    }

    // Update book issue
    bookIssue.returnDate = new Date();
    bookIssue.status = 'RETURNED';
    await bookIssue.save();

    // Increase available copies
    const book = await Book.findById(bookIssue.book._id);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // Populate references
    await bookIssue.populate('student', 'name email rollNumber');
    await bookIssue.populate('issuedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: {
        bookIssue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Student's Issued Books (Student only)
 * GET /api/library/my-books
 */
const getMyBooks = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // Get all book issues for student
    const bookIssues = await BookIssue.find({
      student: studentId,
    })
      .populate('book', 'title author isbn')
      .populate('issuedBy', 'name email')
      .sort({ issueDate: -1 });

    // Update overdue status and calculate days left
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const issue of bookIssues) {
      if (issue.status === 'ISSUED') {
        const dueDate = new Date(issue.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          // Mark as overdue
          issue.status = 'OVERDUE';
          await issue.save();
        }
      }
    }

    // Re-fetch to get updated status
    const updatedIssues = await BookIssue.find({
      student: studentId,
    })
      .populate('book', 'title author isbn')
      .populate('issuedBy', 'name email')
      .sort({ issueDate: -1 });

    // Calculate days left and add to response
    const booksWithDetails = updatedIssues.map((issue) => {
      const daysLeft = issue.getDaysLeft();
      const isOverdue = issue.isOverdue();

      return {
        ...issue.toObject(),
        daysLeft,
        isOverdue,
      };
    });

    // Calculate summary
    const totalIssued = booksWithDetails.filter((b) => b.status !== 'RETURNED').length;
    const overdue = booksWithDetails.filter((b) => b.isOverdue).length;
    const dueSoon = booksWithDetails.filter(
      (b) => b.daysLeft !== null && b.daysLeft > 0 && b.daysLeft <= 2 && !b.isOverdue
    ).length;

    res.status(200).json({
      success: true,
      data: {
        books: booksWithDetails,
        summary: {
          totalIssued,
          overdue,
          dueSoon,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Book Issues (Admin only)
 * GET /api/library/issues
 */
const getAllIssues = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Get book issues with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const bookIssues = await BookIssue.find(query)
      .populate('book', 'title author isbn')
      .populate('student', 'name email rollNumber')
      .populate('issuedBy', 'name email')
      .sort({ issueDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Update overdue status
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const issue of bookIssues) {
      if (issue.status === 'ISSUED') {
        const dueDate = new Date(issue.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          issue.status = 'OVERDUE';
          await issue.save();
        }
      }
    }

    const total = await BookIssue.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookIssues,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send Email Reminders (Internal function)
 * Called periodically or on-demand
 */
const sendOverdueReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find overdue books
    const overdueIssues = await BookIssue.find({
      status: { $in: ['ISSUED', 'OVERDUE'] },
      dueDate: { $lt: today },
    })
      .populate('book', 'title author')
      .populate('student', 'name email');

    // Find books due in 2 days
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    const dueSoonIssues = await BookIssue.find({
      status: 'ISSUED',
      dueDate: {
        $gte: today,
        $lte: twoDaysLater,
      },
    })
      .populate('book', 'title author')
      .populate('student', 'name email');

    // Send overdue emails
    for (const issue of overdueIssues) {
      if (issue.student && issue.student.email) {
        const daysOverdue = Math.ceil(
          (today.getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        await sendEmail({
          to: issue.student.email,
          subject: `[URGENT] Overdue Book: ${issue.book.title}`,
          title: `Book Overdue: ${issue.book.title}`,
          message: `Dear ${issue.student.name},\n\nYour book "${issue.book.title}" by ${issue.book.author} is overdue by ${daysOverdue} day(s).\n\nPlease return it to the library as soon as possible to avoid fines.\n\nDue Date: ${new Date(issue.dueDate).toLocaleDateString()}\n\nThank you.`,
          senderName: 'Acadence Library',
        });

        // Update status to OVERDUE
        if (issue.status !== 'OVERDUE') {
          issue.status = 'OVERDUE';
          await issue.save();
        }
      }
    }

    // Send due soon emails
    for (const issue of dueSoonIssues) {
      if (issue.student && issue.student.email) {
        const daysLeft = Math.ceil(
          (new Date(issue.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        await sendEmail({
          to: issue.student.email,
          subject: `Book Due Soon: ${issue.book.title}`,
          title: `Book Due in ${daysLeft} Day(s)`,
          message: `Dear ${issue.student.name},\n\nThis is a reminder that your book "${issue.book.title}" by ${issue.book.author} is due in ${daysLeft} day(s).\n\nDue Date: ${new Date(issue.dueDate).toLocaleDateString()}\n\nPlease return it on time to avoid overdue fines.\n\nThank you.`,
          senderName: 'Acadence Library',
        });
      }
    }

    return {
      overdueSent: overdueIssues.length,
      dueSoonSent: dueSoonIssues.length,
    };
  } catch (error) {
    console.error('Error sending email reminders:', error);
    return { error: error.message };
  }
};

/**
 * Trigger Email Reminders (Admin only)
 * POST /api/library/send-reminders
 */
const triggerReminders = async (req, res, next) => {
  try {
    const result = await sendOverdueReminders();

    res.status(200).json({
      success: true,
      message: 'Email reminders sent',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBook,
  updateBook,
  getAllBooks,
  issueBook,
  returnBook,
  getMyBooks,
  getAllIssues,
  triggerReminders,
  sendOverdueReminders, // Export for cron jobs
};
