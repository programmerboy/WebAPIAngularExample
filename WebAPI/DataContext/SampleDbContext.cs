using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebAPI.Models;

namespace WebAPI.DataContext
{
    public class SampleDbContext : DbContext
    {
        public SampleDbContext()
            : base("name=SampleDB")
        {

        }

        public DbSet<Student> Students { get; set; }
    }
}