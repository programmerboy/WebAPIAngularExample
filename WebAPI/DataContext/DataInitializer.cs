using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebAPI.DataContext
{
    public class DataInitializer : DropCreateDatabaseIfModelChanges<SampleDbContext>
    {
        protected override void Seed(SampleDbContext context)
        {

        }
    }
}